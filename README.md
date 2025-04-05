# Description


## Development
|steps| syntax|
|-----|-----|
| 1 - Clone repo | ```git clone -- ``` |
| 2 - rename .envTemplate to .env and  change the env variables to your own | ```npm install``` |
| 3 - install dependencies | ```npm install``` |
| 4 - start DB with docker | ```docker-compose up -d``` (is running detach from the terminal) |
| 5 - prisma migration | ```npx prisma migrate dev``` |
| 4 - start dev server | ```npm run dev``` |

# Production