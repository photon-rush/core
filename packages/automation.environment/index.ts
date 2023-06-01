import createEnvironment from '@photon-rush/automation.environment/lib/createEnvironment';


async function main() {
    const environment = await createEnvironment();

    console.log(JSON.stringify(environment, null, '\t'));

    console.log(environment.status.toString(true));
}

main();