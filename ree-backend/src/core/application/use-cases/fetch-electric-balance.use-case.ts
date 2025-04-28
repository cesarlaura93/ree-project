import { Injectable, Logger, Inject } from '@nestjs/common';
import { REEApiRepository } from 'src/core/domain/repositories/ree-api.repository';
import { ElectricBalanceRepository } from 'src/core/domain/repositories/electric-balance.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FetchElectricBalanceUseCase {
    private readonly logger = new Logger(FetchElectricBalanceUseCase.name);
    private readonly daysLag: number
    
    constructor(
        @Inject('REEApiRepository') private readonly reeApiRepository: REEApiRepository,
        @Inject('ElectricBalanceRepository') private readonly electricBalanceRepository: ElectricBalanceRepository,
        private readonly configService: ConfigService,
    ) {
        this.daysLag = this.configService.get<number>('environment.reeApi.daysLag') || 3;
    }

    async execute(): Promise<void> {
        this.logger.log(`Iniciando proceso de obtención del balance eléctrico, días de lag: ${this.daysLag}`);
        
        try {
            // Obtener la fecha y hora actuales
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - this.daysLag);

            //const startDateStr = "2024-05-01T00:00"//yesterday.toISOString().slice(0, 10) + 'T00:00';
            const startDateStr = yesterday.toISOString().slice(0, 10) + 'T00:00';
            //const endDateStr = "2025-04-25T23:59"//yesterday.toISOString().slice(0, 16).replace(/\.\d{3}Z$/, '');
            const endDateStr = yesterday.toISOString().slice(0, 16).replace(/\.\d{3}Z$/, '');
            
            this.logger.debug(`Consultando API REE con parámetros: startDate=${startDateStr}, endDate=${endDateStr}`);
            
            const registers = await this.reeApiRepository.fetchElectricBalance(startDateStr, endDateStr);
            this.logger.verbose('Datos obtenidos correctamente desde la API de REE');

            this.logger.debug('Registros obtenidos:');
            this.logger.debug(JSON.stringify(registers, null, 2));
            
            await this.electricBalanceRepository.saveMany(registers);
            
            this.logger.log('Proceso de obtención del balance eléctrico finalizado con éxito');
        } catch (error) {
            this.logger.error(`Error al obtener el balance eléctrico: ${error.message}`, error.stack);
            throw error;
        }
    }
}