/**
 * @flow
 */

import { Api, Project, FormData } from 'xdl';
import { ApiV2, User } from 'xdl';
import log from '../log';
import * as table from '../commands/utils/cli-table';

export default (program: any) => {
  program
    .command('publish:set [project-dir]')
    .alias('ps')
    .description('Set a published release to be served from a specified channel.')
    .option('-c, --release-channel <channel-name>', 'The channel to set the published release.')
    .option(
      '-p, --publish-id <publish-id>',
      'The id of the published release to serve from the channel.'
    )
    .allowNonInteractive()
    .asyncActionProjectDir(async (projectDir, options) => {
      if (!options.releaseChannel) {
        log.error('You must specify a release channel.');
      }
      if (!options.publishId) {
        log.error('You must specify a publish id.');
      }
      const user = await User.getCurrentUserAsync();
      const api = ApiV2.clientForUser(user);
      try {
        let result = await api.postAsync('publish/set', {
          releaseChannel: options.releaseChannel,
          publishId: options.publishId,
          slug: await Project.getSlugAsync(projectDir, options),
        });
        let tableString = table.printTableJson(
          result.queryResult,
          'Channel Set Status ',
          'SUCCESS'
        );
        console.log(tableString);
      } catch (e) {
        log.error(e);
      }
    });
};
