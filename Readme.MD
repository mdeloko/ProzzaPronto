## Prozza

Alunos:
- Erik Gonçalves Coutinho
- Werickson de Souza Dauta

Instruções:

Para preparar para rodar o backend, entre na pasta back e installe as dependencias do NPM com 

`npm install pg prisma socket.io `

e eventuais outras que possam aparecer

logo após, vá para a pasta src/prisma, e edite o `.env` para as credenciais baterem com seu PostgreSQL instalado
para ficar algo como `DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/prozza-db?schema=public"` e crie o banco `prozza-db` pelo pgAdmin.

abra um terminal ainda no diretório src/prisma e execute

`npx prisma migrate dev`

Para preparar para rodar o front, entre na pasta front e também com npm insira

`npm install express socket.io-client`


Logo após abra 2 terminais, um na pasta back e outro na pasta front, no do back digite

`npm run start`

no do front, digite

`npm run dev`

Desde já gostaria de agradecer a oportunidade de entrega desse código e dizer que não está parecido com o que foi apresentado por eu ter que refazer todo o front com os conhecimentos basicos de html e css que tenho em um dia, mas foi feito de coração e com ***MUITO*** esforço!