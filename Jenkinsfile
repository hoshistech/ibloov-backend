node {
    checkout scm
    docker.withRegistry("https://registry.hub.docker.com", "DockerHub") {

        /*def customImage = docker.build("hoshistech/ibloov-backend-api:${env.BUILD_ID}") */
        def customImage = docker.build("hoshistech/ibloov-backend-api")
        
        /* Push the container to the custom Registry */
        customImage.push('latest')
    }
}