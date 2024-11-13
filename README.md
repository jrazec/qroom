
# QROOM Project Summary and Development Overview
## Completed Features
- QR Scanning: Users can scan designated QR codes to view specific the schedule of a specific room; faculty can tag occupancy of specific room
- User Management: Administrators oversee account management; users have access to basic account settings
- Room scheduling: Allows administrators and faculty to set, update, and manage room schedules efficiently to prevent conflicts
- Room Management: Users can view room detail; administrators can add, update, or delete rooms as needed
- Feedback Review/Mechanism: Uses Gemini API integration to identify feedback reports; users can report issues like cleanliness or equipment damage, enabling prompt responses and better room maintenance

## Challenges Faced and Solutions Applied
- React Components: Simplified complex components by breaking them into smaller, reusable pieces for better performance.
- CSS Modules: Used CSS modules to manage styles efficiently and prevent conflicts.
- API Integrations: Implemented async functions and error handling to ensure reliable and smooth data operations.

## Plans for final completion
- CAPTCHA
- QR Code Generation
- Session Auth
- Analytics Dashboard
- Email Authentication
- Calendar API


## Research Resources/References
- React Documentation: https://react.dev/learn
- Node.js Documentation: https://nodejs.org/docs/latest/api/
- Bootstrap Documentation: https://getbootstrap.com/docs/4.1/getting-started/introduction/

- [DESIGN AND IMPLEMENTATION OF AN ONLINE STUDENT ROOM AVAILABILITY SYSTEM](https://www.researchgate.net/profile/Abubakar-Sani-Jato/publication/379393561_DESIGN_AND_IMPLEMENTATION_OF_AN_ONLINE_STUDENT_ROOM_AVAILABILITY_SYSTEM/links/6606cd27f5a5de0a9fe8bf14/DESIGN-AND-IMPLEMENTATION-OF-AN-ONLINE-STUDENT-ROOM-AVAILABILITY-SYSTEM.pdf)
- [A Web-based Application for School Class Scheduling](https://cite.dpu.ac.th/upload/content/files/Paper_59/Re-022-58-59.pdf)
- [Web-based development of room management information system at Universitas Pertahananusing Rapid Application Development](https://www.idss.iocspublisher.org/index.php/jidss/article/view/254/146)
---------------
# Libraries, API, and Packages Used

## Packages
- npm i express (backend)
- npm i nodemon (Backend)
- npm i axios (Front end)
- npm i dotenv (Backend)
- npm i body-parser (Backend)
- npm i mysql2 (Backend)
- npm i cors (Backend)
- npm i env-cmd (Frontend)
- npm i multer (Backend)

## How to cheack each packages installed in the front/backend
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

- PORT = 3001

- HOST = localhost

- USER = usernamenyusaMYSQL # Not being read

- PASSWORD = passwordnyusaMYSQL

- DATABASE = qroom