import rewrite from '@photon-rush/automation.command.serve/source/rewrite';
import express from 'express';
import { resolve } from 'path';
import serveIndex from 'serve-index';
import createHttpServer from '@photon-rush/automation.command.serve/source/createHttpServer';
import { IEnvironment } from '@photon-rush/automation.environment/lib/createEnvironment';

const FORCE_HTTP = true;

export default async function run(environment: IEnvironment) {
    const locationBase = environment.context.args[0] || '.';
    const location     = resolve(environment.repository.location, locationBase);
    const useRewrite   = !environment.context.args[0];

    console.log(location);

    if (environment.context.global) {
        const application = express();

        if (useRewrite) {
            application.use((request, response, next) => {
                const newUrl = rewrite(request.url, environment);

                if (newUrl !== request.url) {
                    console.log(`${request.url} -> ${newUrl}`);
                    request.url = newUrl;
                } else {
                    console.log(`${request.url}`);
                }

                next();
            });
        }

        application.use('/',
            express.static(location, { dotfiles: 'allow' }),
            serveIndex(location, {
                icons : true,
                hidden: true,
                view  : 'details',
            }),
        );

        if (FORCE_HTTP) {
            await createHttpServer(environment, application);
        } else {
            //TODO make it https
        }
    }
}