#!/bin/bash
set -e

echo "🔄 Iniciando importación de datos..."

# Esperar a que MongoDB esté completamente listo
until mongosh --eval "print(\"MongoDB está listo\")"
do
    echo "Esperando a MongoDB..."
    sleep 2
done

# Importar electric_balance
if [ -f "/docker-entrypoint-initdb.d/ree-balance.electric_balance.json" ]; then
    echo "📥 Importando colección electric_balance..."
    mongoimport --db ree-balance \
                --collection electric_balance \
                --file /docker-entrypoint-initdb.d/ree-balance.electric_balance.json \
                --jsonArray
    echo "✅ electric_balance importada correctamente"
fi

# Importar ree_entities
if [ -f "/docker-entrypoint-initdb.d/ree-balance.ree_entities.json" ]; then
    echo "📥 Importando colección ree_entities..."
    mongoimport --db ree-balance \
                --collection ree_entities \
                --file /docker-entrypoint-initdb.d/ree-balance.ree_entities.json \
                --jsonArray
    echo "✅ ree_entities importada correctamente"
fi

# Crear índices después de importar
echo "📑 Creando índices..."
mongosh ree-balance --eval '
    db.electric_balance.createIndex({ date: 1 });
    db.electric_balance.createIndex({ energy_type: 1, device_type: 1 });
    db.electric_balance.createIndex({ date: 1, energy_type: 1, device_type: 1 });
    db.ree_entities.createIndex({ energy_type: 1 });
'

echo "✅ Importación completada con éxito"