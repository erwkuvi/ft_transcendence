
# Remove migration files in the specified directories
find backend/users/migrations -type f -name "*.py" ! -name "__init__.py" -delete
find backend/notifications/migrations -type f -name "*.py" ! -name "__init__.py" -delete
find backend/friends/migrations -type f -name "*.py" ! -name "__init__.py" -delete

echo "Migration files removed."


find backend/media/avatars/ -type f -name "*" ! -name "avatar.png" -delete

echo "Profile pictures removed."

rm -rf backend/media/qrcode/*

echo "QR code images removed."


rm backend/users/management/command/.env
echo "Env file at command removed."


rm frontend/.env
echo "Env file at frontend removed."
