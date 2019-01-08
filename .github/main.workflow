workflow "CI" {
  on = "push"
  resolves = ["Install"]
}

action "Install" {
  uses = "docker://node:11-alpine"
  runs = "yarn"
}
