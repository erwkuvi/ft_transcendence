find backend/users/migrations -type f -name "*.py" ! -name "__init__.py" -delete
find backend/notifications/migrations -type f -name "*.py" ! -name "__init__.py" -delete
find backend/friends/migrations -type f -name "*.py" ! -name "__init__.py" -delete

echo "Migration files removed."


