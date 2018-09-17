FROM node:6.12.3

# Application

WORKDIR /app/ozp-help
RUN npm install --quiet --progress=false -g gulp > /dev/null

WORKDIR /app/lib
COPY lib .

COPY ozp-help/package.json .
RUN npm install --quiet --progress=false

copy ozp-help .

# Configuration

EXPOSE 8888

CMD gulp dev
# CMD npm start
