pipeline {
   environment {
     dockerRegistry = "hoshistech/ibloov-backend-api"
     dockerRegistryCredential = 'DockerHub'
     dockerImage = ''
   }
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
     stage('Building image') {
       steps{
         script {
           dockerImage = docker.build dockerRegistry + ":$BUILD_NUMBER"
         }
       }
     }
     stage('Upload Image') {
       steps{
         script {
           docker.withRegistry( '', dockerRegistryCredential ) {
             dockerImage.push()
           }
         }
       }
     }
     stage('Remove Unused docker image') {
       steps{
         sh "docker rmi $dockerRegistry:$BUILD_NUMBER"
       }
     }
   }
 }