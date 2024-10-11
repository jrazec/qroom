## Libraries, API, and Packages Used

# Packages
- npm i express (backend)
- npm i nodemon (Backend)
- npm i axios (Front end)
- npm i dotenv (Backend)
- npm i body-parser (Backend)
- npm i mysql2 (Backend)
- npm i cors (Backend)
- npm i env-cmd (Frontend)

# How to cheack each packages installed in the front/backend
npm list --/dev0


## Things to take note 
- TO run client and server side:
##
> go to the qroom_repo directory and run **npm run dev** to enable the backend
##
> then go to the client directory and run **npm start** to access the client

---------------
## How to access via phone from WSL
### Configure Firewall Settings
- Go to Firewall & network protection -> Advanced settings
- On the left pane, click Inbound Rules
- On the actions pane on the right, click 'New Rule...'
- When asked 'What type of rule would you like to create?', choose 'Port', then click on 'Next >'.
- For Protocols and Ports, choose 'TCP'. Then input `3000` in Specific local ports. Then click on 'Next >'.
- Select 'Allow the connection' and 'Next >'
- Leave the default checks on Domain, Private, and Public options. 'Next >'
- Set a name for the rule, e.g. 'Allow port Node.js on Port 3000'
### Port Forwarding to WSL from PowerShell
- Open PowerShell as administrator
- Look for your local machine's IP address via entering the command `ipconfig`
- Enter the command `netsh interface portproxy add v4tov4 listenport=3000 listenaddress=YOUR-IP-ADDRESS-HERE connectport=3000 connectaddress=$($(wsl hostname -I).Trim());`. Don't forget to input your own IP address at the `listenaddress`.
#### You can now try to access the website in a mobile device via the local machine's IP address and the port. Ensure that you are on the same network for it to work.

## Setting up of ENV variables 
- REACT_APP_LOCALHOST = "Your_IP_ADDRESS:3000"

-PORT = 3001

-HOST = localhost
-USER = usernamenyusaMYSQL # Not being read
-PASSWORD = passwordnyusaMYSQL
-DATABASE = qroom