node {
    checkout scm
    docker.withRegistry("https://hub.docker.com", "DockerHub") {

        def customImage = docker.build("hoshistech/ibloov-backend-api:${env.BUILD_ID}")
        
        /* Push the container to the custom Registry */
        customImage.push('latest')
    }
}