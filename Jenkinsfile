// pipeline {
//     agent any

//     environment {
//         EC2_USER = 'ubuntu'
//         EC2_HOST = '43.204.2.23'
//         SSH_KEY = credentials('EC2_SSH_KEY')
//         DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
//         DOCKER_HUB_USERNAME = credentials('DOCKER_HUB_USERNAME')

//         REACT_APP_API_URL = credentials('REACT_APP_API_URL')
//         MONGO_URI = credentials('MONGO_URI')
//         PORT = credentials('PORT')
//         CORS_ORIGIN = credentials('CORS_ORIGIN')
//         SECRET = credentials('SECRET')
//         CLOUDINARY_API_KEY = credentials('CLOUDINARY_API_KEY')
//         CLOUDINARY_API_SECRET = credentials('CLOUDINARY_API_SECRET')
//         CLOUDINARY_CLOUD_NAME = credentials('CLOUDINARY_CLOUD_NAME')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         } 
//         // stage('Frontend Tests') {
//         //     steps {
//         //         dir('frontend') {
//         //             // sh 'npm install'
//         //             sh 'export REACT_APP_API_URL=$REACT_APP_API_URL'
//         //             // sh 'npm test'
//         //         }
//         //     }
//         // }
//         // stage('Backend Tests') {
//         //     steps {
//         //         dir('backend') {
//         //             sh 'npm install'
//         //             sh 'export MONGO_URI=$MONGO_URI'
//         //             sh 'export PORT=$PORT'
//         //             sh 'export CORS_ORIGIN=$CORS_ORIGIN'
//         //             sh 'export SECRET=$SECRET'
//         //             sh 'export CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY'
//         //             sh 'export CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET'
//         //             sh 'export CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME'
//         //             sh 'npm test'
//         //         }
//         //     }
//         // }
//         stage('Make .env file frontend'){
//             steps {
//                 sh 'echo REACT_APP_API_URL=$REACT_APP_API_URL > ./frontend/.env'
//             }
//         }
//         stage('Make .env file backend'){
//             steps {
//                 sh 'echo MONGO_URI=$MONGO_URI > ./backend/.env'
//                 sh 'echo PORT=$PORT >> ./backend/.env'
//                 sh 'echo CORS_ORIGIN=$CORS_ORIGIN >> ./backend/.env'
//                 sh 'echo SECRET=$SECRET >> ./backend/.env'
//                 sh 'echo CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY >> ./backend/.env'
//                 sh 'echo CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET >> ./backend/.env'
//                 sh 'echo CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME >> ./backend/.env'
//             }
//         }
//         stage('Build Docker Images') {
//             steps {
//                 sh 'docker build -t $DOCKER_HUB_USERNAME/brightpath-frontend:latest ./frontend'
//                 sh 'docker build -t $DOCKER_HUB_USERNAME/brightpath-backend:latest ./backend'
//             }
//         }

//         stage('Login to Docker Hub') {
//             steps {
//                 sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
//             }
//         }

//         stage('Push Images to Docker Hub') {
//             steps {
//                 sh 'docker push $DOCKER_HUB_USERNAME/brightpath-frontend:latest'
//                 sh 'docker push $DOCKER_HUB_USERNAME/brightpath-backend:latest'
//             }
//         }

//         // stage('Deploy on EC2') {
//         //     steps {
//         //         sshagent(['EC2_SSH_KEY']) {
//         //             sh '''
//         //             ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST <<EOF
//         //             docker login -u $DOCKER_HUB_CREDENTIALS_USR -p $DOCKER_HUB_CREDENTIALS_PSW
//         //             docker pull $DOCKER_HUB_USERNAME/brightpath-frontend:latest
//         //             docker pull $DOCKER_HUB_USERNAME/brightpath-backend:latest
//         //             docker-compose down
//         //             docker-compose up -d
//         //             EOF
//         //             '''
//         //         }
//         //     }
//         // }
//     }

//     // post {
//     //     always {
//     //         sh 'docker logout'
//     //     }
//     // }
// }


pipeline {
    agent any
    
    options {
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '43.204.2.23'
        SSH_KEY = credentials('EC2_SSH_KEY')
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
        DOCKER_HUB_USERNAME = credentials('DOCKER_HUB_USERNAME')

        REACT_APP_API_URL = credentials('REACT_APP_API_URL')
        MONGO_URI = credentials('MONGO_URI')
        PORT = credentials('PORT')
        CORS_ORIGIN = credentials('CORS_ORIGIN')
        SECRET = credentials('SECRET')
        CLOUDINARY_API_KEY = credentials('CLOUDINARY_API_KEY')
        CLOUDINARY_API_SECRET = credentials('CLOUDINARY_API_SECRET')
        CLOUDINARY_CLOUD_NAME = credentials('CLOUDINARY_CLOUD_NAME')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Backend Tests') {
            steps {
                dir('backend') {
                    // Memory-optimized npm install
                    sh 'npm --max-old-space-size=512 ci --production'
                    
                    // Export environment variables
                    sh 'export MONGO_URI=$MONGO_URI'
                    sh 'export PORT=$PORT'
                    sh 'export CORS_ORIGIN=$CORS_ORIGIN'
                    sh 'export SECRET=$SECRET'
                    sh 'export CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY'
                    sh 'export CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET'
                    sh 'export CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME'
                    
                    // Run tests with limited resources
                    sh 'npm test -- --maxWorkers=1'
                }
            }
        }
        
        stage('Make .env file frontend') {
            steps {
                sh 'echo REACT_APP_API_URL=$REACT_APP_API_URL > ./frontend/.env'
            }
        }
        
        stage('Make .env file backend') {
            steps {
                sh 'echo MONGO_URI=$MONGO_URI > ./backend/.env'
                sh 'echo PORT=$PORT >> ./backend/.env'
                sh 'echo CORS_ORIGIN=$CORS_ORIGIN >> ./backend/.env'
                sh 'echo SECRET=$SECRET >> ./backend/.env'
                sh 'echo CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY >> ./backend/.env'
                sh 'echo CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET >> ./backend/.env'
                sh 'echo CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME >> ./backend/.env'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                // Use BuildKit and cache for more efficient builds
                sh 'docker build --build-arg BUILDKIT_INLINE_CACHE=1 --cache-from $DOCKER_HUB_USERNAME/brightpath-frontend:latest -t $DOCKER_HUB_USERNAME/brightpath-frontend:latest ./frontend'
                sh 'docker build --build-arg BUILDKIT_INLINE_CACHE=1 --cache-from $DOCKER_HUB_USERNAME/brightpath-backend:latest -t $DOCKER_HUB_USERNAME/brightpath-backend:latest ./backend'
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
    }

    post {
        always {
            // Clean up to free resources
            sh 'docker system prune -f'
            sh 'docker logout || true'
        }
    }
}