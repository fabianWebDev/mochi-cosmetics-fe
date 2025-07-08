echo "🧼 Apagando contenedores anteriores (si existen)..."
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

echo "💻 Levantando frontend en modo desarrollo con hot reload..."
docker-compose -f docker-compose.dev.yml up --build