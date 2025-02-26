
# Remove migration files in the specified directories
find /users/migrations -type f -name "*.py" ! -name "__init__.py" -delete
find /notifications/migrations -type f -name "*.py" ! -name "__init__.py" -delete
find /friends/migrations -type f -name "*.py" ! -name "__init__.py" -delete

echo "Migration files removed."


find media/avatars/ -type f -name "*" ! -name "avatar.png" -delete
echo "Profile pictures removed."

rm -rf media/qrcode/*
echo "QR code images removed."


# Check if the .env file exists before removing it
if [ -f users/management/command/.env ]; then
    rm users/management/command/.env
    echo "Env file at command removed."
else
    echo "No .env file found at command."


if [ -f ../frontend/.env ]; then
    rm ../frontend/.env
    echo "Env file at command removed."
else
    echo "No .env file found at command."


