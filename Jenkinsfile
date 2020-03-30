node {
    def app

    stage('Clone repository') {
        /* Cloning the Repository to our Workspace */

        checkout scm
    }

    stage('Build image') {
        /* This builds the actual image */

        app = docker.build("hoshistech/ibloov-backend-api")
    }

    stage('Test image') {
        
        app.inside {
            echo "Tests passed"
        }
        //sh 'npm run test'
    }

    stage('Push image') {

        /** 
		* You would need to first register with DockerHub before you can push images to your account
		*/
        docker.withRegistry('https://registry.hub.docker.com', 'DockerHub') {

            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        } 

        echo "Trying to Push Docker Build to DockerHub"
    }
}