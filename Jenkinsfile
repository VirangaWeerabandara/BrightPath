pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '43.204.2.23'
        SSH_KEY = credentials('EC2_SSH_KEY')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/VirangaWeerabandara/BrightPath.git'
            }
        } 

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t react-frontend ./frontend'
                sh 'docker build -t node-backend ./backend'
            }
        }

        stage('Save Docker Images') {
            steps {
                sh 'docker save -o react-frontend.tar react-frontend'
                sh 'docker save -o node-backend.tar node-backend'
            }
        }

        stage('Transfer Images to EC2') {
            steps {
                sh 'scp -i $SSH_KEY react-frontend.tar $EC2_USER@$EC2_HOST:/home/ubuntu/'
                sh 'scp -i $SSH_KEY node-backend.tar $EC2_USER@$EC2_HOST:/home/ubuntu/'
                sh 'scp -i $SSH_KEY docker-compose.yml $EC2_USER@$EC2_HOST:/home/ubuntu/'
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['EC2_SSH_KEY']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST <<EOF
                    docker load -i react-frontend.tar
                    docker load -i node-backend.tar
                    docker-compose down
                    docker-compose up -d
                    EOF
                    '''
                }
            }
        }
    }
}
