import React from 'react'
import ReactDOM from 'react-dom'
import { AppComp } from './comp/AppComp'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.render(
	<React.StrictMode>
		<AppComp />
	</React.StrictMode>,
	document.getElementById('root'),
)

serviceWorkerRegistration.register()
