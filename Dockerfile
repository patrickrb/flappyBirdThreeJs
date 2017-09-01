FROM node:6.9.5

# Set environment variables.
ENV NODE_ENV development
ENV FRONTEND_APP_PATH "/usr/local/src/frontend"
ENV APP_USER "flappybird"
ENV APP_USER_HOME "/home/flappybird"


# Add the Application User the the container
RUN mkdir ${APP_USER_HOME} && \
    groupadd -r ${APP_USER} -g 433 && \
    useradd -u 431 -r -g ${APP_USER} -d ${APP_USER_HOME} -s /sbin/nologin -c "Docker image user" ${APP_USER} && \
    chown -R ${APP_USER}:${APP_USER} ${APP_USER_HOME}

# basics
RUN apt-get install -y openssl

# install RVM, Ruby, and Bundler
RUN \curl -L https://get.rvm.io | bash -s stable
RUN /bin/bash -l -c "rvm requirements"
RUN /bin/bash -l -c "rvm install 2.0"
RUN /bin/bash -l -c "gem install bundler --no-ri --no-rdoc"

#--- NODEJS, NPM, GIT and make directories for the application
RUN	npm install --global bower grunt-cli

RUN /bin/bash -l -c "gem install sass"

# Add the production application
ADD ./ ${FRONTEND_APP_PATH}

# Application user should own the app directory
RUN chown -R ${APP_USER}:${APP_USER} ${FRONTEND_APP_PATH}
WORKDIR ${FRONTEND_APP_PATH}

# install dependencies as the application user and build the applcation
USER flappybird
RUN npm install
RUN bower install

# Application will be available at the following ports
EXPOSE 9000

# Run this command when the container starts
CMD ["grunt", "serve"]
