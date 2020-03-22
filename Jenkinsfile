node {
    checkout scm
    docker.withRegistry("hoshistech/ibloov-backend-api", "DockerHub") {

        def customImage = docker.build("hoshistech/ibloov-backend-api:${env.BUILD_ID}")
        
        /* Push the container to the custom Registry */
        customImage.push('latest')
    }
}