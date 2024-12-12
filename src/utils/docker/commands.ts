export const DOCKER_COMMANDS = {
  PULL_KALI: 'docker pull kalilinux/kali-rolling',
  RUN_KALI: 'docker run -d --name kali-security -p 2222:22 -p 8080:80 -p 8443:443 kalilinux/kali-rolling',
  STOP_CONTAINER: 'docker stop',
  REMOVE_CONTAINER: 'docker rm',
  EXEC_COMMAND: 'docker exec'
} as const;