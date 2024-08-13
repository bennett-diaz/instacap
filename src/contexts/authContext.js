import { createContext, useContext, useEffect, useState } from 'react';
import { myAuthObj } from '../firebaseConfig'
import { onAuthStateChanged, signOut, deleteUser, PhoneAuthProvider, AnonymousAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

    myAuthObj.useDeviceLanguage();
    myAuthObj.settings.appVerificationDisabledForTesting = false;

    const [curUser, setCurUser] = useState(null);

    const firebaseUI = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(myAuthObj);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(myAuthObj, (user) => {
            if (user) {
                setCurUser(user);
                console.log('Firebase user found; setting current user');
            } else {
                console.log('Firebase user not found');
            }
        });
        return () => {
            console.log('Unsubscribing from auth state monitoring');
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (curUser) {
            console.log('LIFECYCLE: curUser uid:', curUser.uid);
        } else {
            console.log('LIFECYCLE: no curUser');
        }
    }, [curUser]);


    const handleSuccessfulSignIn = (authResult, redirectUrl) => {
        console.log('SUCCESS')
        if (authResult.additionalUserInfo.isNewUser) {
            console.log('New user signed in with UID:', authResult.user.uid);
        }
        return true
    };

    const handleSignOut = async () => {
        try {
            await signOut(myAuthObj);
            setCurUser(null);
            console.log('Sign-out successful');
        } catch (error) {
            console.error('Sign-out error: ', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (!curUser) {
            console.error('No user to delete.');
            return;
        }
        try {
            console.log('curUser to be deleted:', curUser)
            await deleteUser(curUser);
            console.log('User deleted successfully');
            await handleSignOut();
        } catch (error) {
            console.error('Account deletion error: ', error);
        }
    };


    const handleSignInFailure = (error) => {
        console.log('FAILURE')
        console.log('Sign-in error: ', error)
    }

    const handleUIRender = () => {
        document.getElementById('loader').style.display = 'none';
    }


    const firebaseUIConfig = {
        callbacks: {
            signInSuccessWithAuthResult: handleSuccessfulSignIn,
            signInFailure: handleSignInFailure,
            uiShown: handleUIRender,
        },
        signInFlow: 'popup', // 'popup' or 'redirect'
        // signInSuccessUrl: 'instacap.ai', // only relevant for redirect flow
        signInOptions: [
            {
                provider: PhoneAuthProvider.PROVIDER_ID,
                fullLabel: 'Continue with SMS',
                recaptchaParameters: {
                    type: 'image', // 'audio'
                    size: 'normal', // 'normal' 'invisible' or 'compact'
                    badge: 'inline', // 'bottomright' or 'inline'
                },
                defaultCountry: 'US',
                // defaultNationalNumber: '1234567890',
                // loginHint: '+11234567890',
                // whitelistedCountries: ['US']
            },
            // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        immediateFederatedRedirect: false,
        tosUrl: 'https://instacap.ai/terms',
        privacyPolicyUrl: 'https://instacap.ai/privacy'
    };


    return (
        <AuthContext.Provider value={{ firebaseUI, firebaseUIConfig, curUser, handleSignOut, handleDeleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);