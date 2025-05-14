function restartAllContainers() {
    return new Promise((resolve, reject) => {
        exec('docker ps -q', (error, stdout, stderr) => {
            if (error) {
                console.error(`Ошибка при получении контейнеров: ${error.message}`)
                return reject(error)
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`)
                return reject(stderr)
            }

            const containerIds = stdout.trim().split('\n')
            if (containerIds.length > 0) {
                const restartCommand = `powershell -Command "docker restart ${containerIds.join(' ')}"`
                exec(restartCommand, (restartError, restartStdout, restartStderr) => {
                    if (restartError) {
                        console.error(`Ошибка при перезапуске контейнеров: ${restartError.message}`)
                        return reject(restartError)
                    }
                    if (restartStderr) {
                        console.error(`stderr: ${restartStderr}`)
                        return reject(restartStderr)
                    }
                    console.log(`Контейнеры перезапущены: \n${restartStdout}`)
                    resolve(restartStdout)
                })
            } else {
                console.log('Нет запущенных контейнеров для перезапуска.')
                resolve('Нет контейнеров')
            }
        })
    })
}

module.exports = {
    restartAllContainers
}