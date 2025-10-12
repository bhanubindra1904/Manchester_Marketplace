import { supabase } from './supabase';

const AUTHENTICATION_SERVICE_URL = 'https://studentnet.cs.manchester.ac.uk/authenticate/';
const LOGOUT_URL = 'https://studentnet.cs.manchester.ac.uk/systemlogout.php';
const DEVELOPER_URL = 'http://localhost:3001';

export class Authenticator {

    // Validates that a user has a University of Manchester account.
    // If the user is not authenticated, redirects for authentication.

    static async validateUser(): Promise<void> {
        const csticket = new URLSearchParams(window.location.search).get('csticket');
        const storedCsticket = sessionStorage.getItem('csticket');
        
        if (!csticket && !storedCsticket) {
          this.sendForAuthentication();
          // throw new Error("Redirecting for authentication"); // Throw error to reject the promise
        }
      
        if (!csticket || !storedCsticket || csticket !== storedCsticket) {
          this.sendForAuthentication();
          // throw new Error("Redirecting for authentication"); // Throw error
        }
      
        if (!(await this.isGETParametersMatchingServerAuthentication())) {
          this.sendForAuthentication();
          // throw new Error("Redirecting for authentication"); // Throw error
        }
      
        await this.recordAuthenticatedUser();
      }

    // Redirects the user to the authentication service.

    private static sendForAuthentication(): void {
        const csticket = this.generateCSTICKET();
        sessionStorage.setItem('csticket', csticket);

        const url = this.getAuthenticationURL('validate');
        window.location.href = url;
    }

    // Constructs the URL required to send the client for authorization.
    // @param command - The command to send with the URL.
    // @returns string

    private static getAuthenticationURL(command: string): string {
        const currentURL = window.location.origin + window.location.pathname;
        const csticket = sessionStorage.getItem('csticket');
        return `${AUTHENTICATION_SERVICE_URL}?url=${encodeURIComponent(currentURL)}&csticket=${csticket}&version=3&command=${command}`;
    }

    // Records that a user is authenticated.

    private static async recordAuthenticatedUser(): Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const username = this.sanitizeInput(urlParams.get('username'));
        const fullname = this.sanitizeInput(urlParams.get('fullname'));

        console.log('Got username:', username, 'fullname:', fullname);

        // Set session storage
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('fullname', fullname);

        try {

            // Check if user exists
            const { data: existingUser, error: fetchError } = await supabase
                .from('User')
                .select()
                .eq('username', username)
                .single();

            // User does not exist - create new user
            if (fetchError || !existingUser) {

                const { data: newUser, error: insertError } = await supabase
                    .from('User')
                    .insert([{ 
                        id: username, 
                        fullname: fullname,
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (!insertError) {
                    console.log('New user created:', newUser);
                }

            // Silently handle insert errors - user might already exist
            } else {
                console.log('Existing user logged in:', existingUser);
            }

        } catch (error) {

            // Log error but don't throw - allow authentication to proceed
            console.log('Database operation note:', error);
        }
    }

    // Checks if the GET parameters match the server authentication.
    // @returns boolean

    private static async isGETParametersMatchingServerAuthentication(): Promise<boolean> {

        try {
            const url = this.getAuthenticationURL('confirm');
            const username = encodeURIComponent(this.sanitizeInput(new URLSearchParams(window.location.search).get('username') || ''));
            const fullname = encodeURIComponent(this.sanitizeInput(new URLSearchParams(window.location.search).get('fullname') || ''));
        
            // Fetch request with options
            const response = await fetch(`${url}&username=${username}&fullname=${fullname}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Accept': 'text/plain'
                }
            });

            const responseBody = await response.text();
            console.log(JSON.parse(responseBody));
            return JSON.parse(responseBody);

        } catch (error) {
            console.error('Server authentication error:', error);
            this.failAuthentication();
            return false;
        }
    }

    private static failAuthentication(): void {
        const errorMessage = '<h1>ERROR</h1><p>Authentication failed.</p>' +
            '<p>Suspected man-in-the-middle attack.</p>' +
            '<p>The data in the URL GET parameters do not match those authenticated on the CAS proxy server.</p>';
        document.body.innerHTML = errorMessage;
        sessionStorage.clear();
        // window.location.href = LOGOUT_URL;
    }

    // Gets the timestamp when the user authenticated.
    // @returns string | null

    public static getTimeAuthenticated(): string | null {
        return sessionStorage.getItem('authenticated');
    }

    // Gets the user's username.
    // @returns string | null

    public static getUsername(): string | null {
        return sessionStorage.getItem('username');
    }

    // Gets the user's full name.
    // @returns string | null

    public static getFullName(): string | null {
        return sessionStorage.getItem('fullname');
    }

    // Invalidates a user by removing session data.
    // @returns void

    public static invalidateUser(): void {
        sessionStorage.clear();
        const logoutUrl = LOGOUT_URL;
        window.location.href = logoutUrl;
    }

    // Sanitizes input to prevent XSS.
    // @param input - The input to sanitize.
    // @returns string

    private static sanitizeInput(input: string | null): string {
        if (!input) return '';
        // Basic XSS prevention - remove HTML tags and trim
        return input.replace(/[<>]/g, '').trim();
    }

    // Generates a unique CSTICKET (to be implemented).
    // @returns string

    private static generateCSTICKET(): string {
        return crypto.randomUUID();
    }
}

// Navigation click handler: refresh page if already on that route
export const handleNavClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (window.location.pathname === href) {
    e.preventDefault();
    window.location.reload();
  }
};