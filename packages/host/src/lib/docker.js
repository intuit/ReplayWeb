import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })
const dockerFolder = 'docker.example.com/dev/test/replayui/team'

/**
 * Function to determine the image name based on looking for it locally built
 * @private
 * @param {boolean} local - Whether or not to generate the local name
 * @returns {string} - The image name
 */
export function imageName(local = false) {
  return `${
    local ? 'replay' : dockerFolder
  }/crossbrowser-local-orchestrator:latest`
}

/**
 * Pulls the specified image from docker, and resolves when the download
 * completes
 * @private
 * @async
 * @param {string} image - The name of the image to pull
 * @returns {Promise<Object>} - An object with the output from it finishing
 */
export function pullImage(image) {
  return new Promise((resolve, reject) => {
    docker.pull(image, (err, stream) => {
      if (err) {
        reject(err)
      }
      function onFinished(e, output) {
        if (e) {
          reject(e)
        }
        resolve(output)
      }
      docker.modem.followProgress(stream, onFinished, () => {})
    })
  })
}

/**
 * Finds if any local images in docker are tagged with the image name
 * so it can use the local image instead of pulling
 * @private
 * @async
 * @param {string} image - The name of the image to look for
 * @returns {Array<Object>} - An array of docker images with the image name in the RepoTags
 */
export async function findLocalImages(image) {
  const images = await docker.listImages()
  return images.filter(i => i.RepoTags && i.RepoTags.includes(image))
}
/**
 * Finds if the orchestrator exists locally, and either starts it or
 * pulls the remote version from artifactory and starts it
 * @async
 * @param {number} port - The port to pass on to the orchestrator to listen on
 * @returns {Promise<Object>} - Information about the running container
 */
export async function startOrchestrator(port) {
  const localImages = await findLocalImages(imageName(true))
  if (localImages.length === 0) {
    await pullImage(imageName())
  }
  const container = await docker.createContainer({
    Image: imageName(localImages.length > 0),
    name: 'local-orchestrator',
    Env: [`PORT=${port}`],
    ExposedPorts: {
      [`${port}/tcp`]: {}
    },
    HostConfig: {
      AutoRemove: true,
      Binds: ['/var/run/docker.sock:/var/run/docker.sock'],
      PortBindings: {
        [`${port}/tcp`]: [{ HostPort: `${port}` }]
      }
    }
  })
  return container.start()
}
