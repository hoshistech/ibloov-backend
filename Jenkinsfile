node {
    checkout scm
    doker.withRegistry("https://registry.hub.docker.com", "DockerHub")
    def customImage = docker.build("hoshistech/ibloov-backend-api:${env.BUILD_ID}")
    customImage.push()

    customImage.push('latest')
}