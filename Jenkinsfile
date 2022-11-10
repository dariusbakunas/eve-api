pipeline {
    agent any

    stages {
      stage('Clone repository') {
        steps {
          script{
            checkout scm
          }
        }
      }

      stage('Build') {
        steps {
          script{
            app = docker.build("eve-api:${BUILD_NUMBER}")
          }
        }
      }
    }

}
