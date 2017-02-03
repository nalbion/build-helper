# This is a WORK IN PROGRESS

## CLI Commands (None supported yet)

  - `bh init`
    - parses `~/.build-helper.yml`, `./build-helper.yml`, `./package.json` or `./pom.xml`
    - prompts for required info, offering defaults
      - name, version, language, ci, cd, template repo
    - writes `build-helper.yml`
        
  - `bh gen xxxx`, `bh update xxxx`, `bh run xxxx param1 param2...`
    - runs a recipe configured in the template repo
    
  - `bh version` 
    - Displays your app's version and prompts for a new version
    - checks that the repo is clean
    - creates a git tag and pushes code and tag
   
  - `bh deploy`, `bh rollback`
      
  - `bh connect`, `bh disconnect`/`bh kill`
    - connects to the remote chat bot so that the bot can view & edit project files remotely
    - runs as a daemon service
    - communicates of SSH/HTTPS - Docker?  ...configurable within build-helper.yml
    
  - `bh bot`
    - starts a conversation with the chat bot
