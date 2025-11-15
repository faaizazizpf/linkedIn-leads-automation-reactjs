FROM node:lts-alpine

# environment
ENV NEXT_PUBLIC_APP_ENV='sandbox'

# host env
ENV NEXT_PUBLIC_APP_HOST='https://newson.ytechlabs.co'
ENV NEXT_PUBLIC_API_HOST='https://newson.ytechlabs.co'

#google
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID='940422043632-p47g1g97d45n43uka8gkga5fpo6bvo73.apps.googleusercontent.com'

# set work directory
WORKDIR /usr/src/app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN echo "Installing dependencies"
RUN yarn install --frozen-lockfile

COPY ./ ./

RUN yarn build

COPY ./commands.sh /usr/src/app/commands.sh

RUN ["chmod", "+x", "/usr/src/app/commands.sh"]
ENTRYPOINT ["sh", "/usr/src/app/commands.sh"]
