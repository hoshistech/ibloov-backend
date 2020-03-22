pipeline {
  agent any
  tools {nodejs "node" }

  stages {
    stage('Cloning Git') {
      steps {
        git 'https://theekhay@bitbucket.org/xpasson/ibloov-backend.git'
      }
    }

    stage('Build') {
       steps {
         sh 'npm install'
       }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
}