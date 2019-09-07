# OSS Manager

[![Node.js](https://img.shields.io/badge/Node.js-10.16.2-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6.9.0-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](https://img.shields.io/:license-mit-blue.svg)](https://opensource.org/licenses/MIT)

[![OAuth2](https://img.shields.io/badge/OAuth2-v1-green.svg)](https://forge.autodesk.com/)
[![Design Automation](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](https://forge.autodesk.com/)

**OSS** stands for **Object Storage Service** which enables you to store your files on **Forge** and do further processing on them using other services like the **Model Derivative Service**

This utility app lets you to see and create new buckets on **OSS**, upload and download files, convert them to other formats, view them online and quesry meta data from them 

### Thumbnail

![thumbnail](/readme/OssManager.png)

### Live version

[https://oss-manager.autodesk.io](https://oss-manager.autodesk.io)

# Usage

1. **On the top** you can provide your **Forge** app's **Client Id** and **Client Secret** to use for authentication\
It also has a **Progress Info** field where information about the progress of the translation or any other warnings or successes will be displayed\
When you **right-click** a file then apart from being able to **delete** it or **download** it, you can also generate a **read/write** publicly accessible **URL** for it \
This can come very handy when working with other services that require such **URLs** in order to provide **input/output** to them, like the **Design Automation Service** 

![thumbnail](/readme/RightClick.png)

2. **On the left** side you'll find all the **OSS** related functionality: listing all your **buckets** and **files**, creating new **buckets**, uploading/downloading **files** \
When translating to the **OBJ** format then what will be included in that file depends on the object selection in the **Hieararchy Tree** (if no object is selected then the whole file will be translated) - all other translations will translate the whole file no matter which objects are selected 

3. **In the center** you'll find all the **Model Derivative** functionality: showing the **hierarchy** of objects inside the file, providing **translations** available for the given file, and showing **meta data** for selected component \
Using the **Delete** button you can delete the current manifest of the file - it can be useful if the translation failed for a given file and you want to try it again (maybe in the meantime you also uploaded a new version of the file under the same name so you do need a new translatoin)

4. **On the right** side you'll find the **Forge Viewer** that will display the model in its default format: may that be **2D** or **3D**



# Setup

## Prerequisites

1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). 
2. **Visual Studio**: Either Community (Windows) or Code (Windows, MacOS).
3. **JavaScript** basic knowledge with **jQuery**

### Run locally

Install [NodeJS](https://nodejs.org).

Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/adamenagy/da.manager-nodejs

To run it, install the required packages, set the enviroment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

Mac OSX/Linux (Terminal) / Windows (use <b>Node.js command line</b> from Start menu)

    npm install
    npm start

Open the browser: [http://localhost:3000](http://localhost:3000).

**Important:** do not use **npm start** locally, this is intended for PRODUCTION only with HTTPS (SSL) secure cookies.

## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/adamenagy/oss.manager-nodejs)

Watch [this video](https://www.youtube.com/watch?v=Oqa9O20Gj0c) on how deploy samples to Heroku.


## Packages used

All Autodesk Forge NPM packages are included by default, see complete list of what's available at [NPM website](https://www.npmjs.com/browse/keyword/autodesk). OAuth, Model Derivative and OSS are used. Some other non-Autodesk packaged are used, including [express](https://www.npmjs.com/package/express) and its session/cookie middlewares ([express-session](https://www.npmjs.com/package/express-session) and [cookie-parser](https://www.npmjs.com/package/cookie-parser)) for user session handling. The front-end uses [bootsrap](https://www.npmjs.com/package/bootstrap) and [jquery](https://www.npmjs.com/package/jquery).

## Tips & tricks

For local development/testing, consider use [nodemon](https://www.npmjs.com/package/nodemon) package, which auto restart your node application after any modification on your code. To install it, use:

    sudo npm install -g nodemon

Then, instead of <b>npm run dev</b>, use the following:

    npm run nodemon

Which executes **nodemon server.js --ignore www/**, where the **--ignore** parameter indicates that the app should not restart if files under **www** folder are modified.

## Further Reading

Documentation:

- [Data Management API](https://forge.autodesk.com/en/docs/data/v2/developers_guide/overview/)

Tutorials:

- [View your models](https://learnforge.autodesk.io/#/tutorials/viewmodels)
- [Create an App-Managed Bucket and Upload a File](https://forge.autodesk.com/en/docs/data/v2/tutorials/app-managed-bucket/)

Blogs:

- [Forge Blog](https://forge.autodesk.com/blog)

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Adam Nagy (Forge Partner Development)<br />
http://forge.autodesk.com<br />