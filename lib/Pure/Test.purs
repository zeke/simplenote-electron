module Pure.Test where

import Prelude

data AuthStatus
	= LoggedOut
	| Authorizing
	| Authorized

instance eqAuthStatus :: Eq AuthStatus where
	eq LoggedOut LoggedOut = true
	eq Authorizing Authorizing = true
	eq Authorized Authorized = true
	eq _ _ = false
	
type Username = String
	
data Msg
	= Logout
	| Login Username


type AuthState =
	{ status :: AuthStatus
	}
	
initialState :: AuthState
initialState = { status: LoggedOut }

reducer :: AuthState -> Msg -> AuthState
reducer state msg =
	case msg of
		Logout ->
			case state.status of
				LoggedOut -> state
				_ -> state { status = LoggedOut }
		
		Login name -> state { status = Authorizing }

isLoggedIn :: AuthState -> Boolean
isLoggedIn state = state.status == Authorized

