import { Box } from '@gluestack-ui/themed';

export const errorPage = ({ error, resetErrorBoundary }) => {

    return (
        <Box>
            <h1>Custom fallback UI</h1>
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            {/* <button onClick={resetErrorBoundary}>Try again</button> */}
        </Box>

    );
};

export const logErrorToService = ({ error, info }) => {
    // console.error("BD FallbackUI error:", error, info);
}


export default { errorPage, logErrorToService };