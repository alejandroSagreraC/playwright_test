pipeline {
    agent none // Agents are defined per stage to optimize resource usage

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['qa', 'stg', 'prod'], description: 'Select target environment')
        string(name: 'SHARD_TOTAL', defaultValue: '2', description: 'Total number of parallel workers')
    }

    environment {
        // Official Playwright image with all browsers pre-installed
        PLAYWRIGHT_IMAGE = 'mcr.microsoft.com/playwright:v1.59.1-noble'
        // Injecting the secret from Jenkins Credentials Store
        ADMIN_PASS = credentials('CI_E2E_PASSWORD') 
    }

    stages {
        stage('Setup & Compilation') {
            agent { docker { image "${env.PLAYWRIGHT_IMAGE}" } }
            steps {
                sh 'npm ci'
                sh 'npx bddgen' // Transpiles Gherkin to Playwright TS
            }
        }

        stage('Parallel Execution') {
            parallel {
                stage('Shard 1') {
                    agent { 
                        docker { 
                            image "${env.PLAYWRIGHT_IMAGE}"
                            args '--ipc=host --user root' // Critical for browser stability
                        } 
                    }
                    steps {
                        // Execution using cross-env for the environment and sharding
                        sh "npx cross-env ENV=${params.ENVIRONMENT} npx playwright test --shard=1/${params.SHARD_TOTAL}"
                    }
                }
                stage('Shard 2') {
                    agent { 
                        docker { 
                            image "${env.PLAYWRIGHT_IMAGE}"
                            args '--ipc=host --user root'
                        } 
                    }
                    steps {
                        sh "npx cross-env ENV=${params.ENVIRONMENT} npx playwright test --shard=2/${params.SHARD_TOTAL}"
                    }
                }
            }
        }

        stage('Reporting') {
            agent { docker { image "${env.PLAYWRIGHT_IMAGE}" } }
            steps {
                // Merges separate shard results into a single report
                sh 'npx playwright merge-reports ./blob-report'
            }
        }
    }

    post {
        always {
            // Store results in Jenkins for auditing
            archiveArtifacts artifacts: 'playwright-report/**, blob-report/*.zip', allowEmptyArchive: true
            
            // Generate visual report if the plugin is available
            // cucumber buildStatus: 'UNSTABLE', fileIncludePattern: '**/cucumber-report.json'
        }
        failure {
            echo "❌ Pipeline failed on ${params.ENVIRONMENT}. Review the Trace Viewer artifacts."
        }
    }
}