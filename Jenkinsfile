pipeline {
    agent any

    stages {
        stage('Clone repository') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Test') {
            steps {
                nvm (16.16.0) {
                    sh 'yarn install --frozen-lockfile'
                    sh 'yarn test'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    app = docker.build("dariusbakunas/eve-api")
                }
            }
        }

        stage('Push image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
    }

}
