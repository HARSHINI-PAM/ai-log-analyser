pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/HARSHINI-PAM/ai-log-analyser'
            }
        }
        stage('Install Dependencies') {
    steps {
        bat 'pip install -r ml/requirements.txt'
           }
       }
       stage('Train Model') {
    steps {
        dir('ml') {
            bat 'python train_model.py'
        }
       }
     }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t ai-log-analyser .'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 5000:5000 ai-log-analyser'
            }
        }
    }

    post {
        success {
            echo '🎉 Build and Deployment Successful!'
        }
        failure {
            echo '❌ Build Failed! Check the logs.'
        }
    }
}


