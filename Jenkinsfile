pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '43.204.2.23'
        SSH_KEY = credentials('EC2_SSH_KEY')
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
        DOCKER_HUB_USERNAME = credentials('DOCKER_HUB_USERNAME')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/VirangaWeerabandara/BrightPath.git'
            }
        } 

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t $DOCKER_HUB_USERNAME/brightpath-frontend:latest ./frontend'
                sh 'docker build -t $DOCKER_HUB_USERNAME/brightpath-backend:latest ./backend'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh 'docker push $DOCKER_HUB_USERNAME/brightpath-frontend:latest'
                sh 'docker push $DOCKER_HUB_USERNAME/brightpath-backend:latest'
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['EC2_SSH_KEY']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST <<EOF
                    docker login -u $DOCKER_HUB_CREDENTIALS_USR -p $DOCKER_HUB_CREDENTIALS_PSW
                    docker pull $DOCKER_HUB_USERNAME/brightpath-frontend:latest
                    docker pull $DOCKER_HUB_USERNAME/brightpath-backend:latest
                    docker-compose down
                    docker-compose up -d
                    EOF
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}