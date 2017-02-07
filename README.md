# This is a WORK IN PROGRESS

## CLI Commands (None supported yet)

  - `bh init`
    - parses `~/.build-helper.yml`, `./build-helper.yml`, `./package.json` or `./pom.xml`
    - prompts for required info, offering defaults
      - name, version, language, ci, cd, template repo
    - writes `build-helper.yml` and possibly `package.json` or `pom.xml`
    
  - `bh init team`
    - initialise global configuration for a team ('personal', 'company-a', 'os-project-x')
    
  - `bh set cloud=google|aws|huroku`
        
  - `bh gen <template_name>`, `bh update <template_name>`, `bh run <script_name> param1 param2...`
    - runs a recipe configured in the template repo
    
  - `bh cache templates/<template_name>`, `bh cache scripts/<script_name>`
    - copies the template/script into `./.build-helper/` 
    
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
