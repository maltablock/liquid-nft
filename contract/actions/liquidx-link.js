const initEnvironment = require(`eosiac`);

const envName = process.env.EOSIAC_ENV || `wax`;
const { sendTransaction, env } = initEnvironment(envName, { verbose: true });

const accounts = Object.keys(env.accounts);

const CONTRACT_ACCOUNT = accounts[1];

const EOS_ACCOUNT = `maltablock.e`;
const WAX_ACCOUNT = `maltareports`;
const WAX_DSP = `maltablokdsp`;

async function action() {
  try {
    if (envName === `wax`) {
      await sendTransaction([
        {
          account: `dappservicex`,
          name: `setlink`,
          authorization: [
            {
              actor: WAX_ACCOUNT,
              permission: `active`,
            },
          ],
          data: { mainnet_owner: EOS_ACCOUNT, owner: WAX_ACCOUNT },
        },
        {
          account: `dappservicex`,
          name: `adddsp`,
          authorization: [
            {
              actor: WAX_ACCOUNT,
              permission: `active`,
            },
          ],
          data: {
            dsp: WAX_DSP,
            owner: WAX_ACCOUNT,
          },
        },
      ]);
    } else if (envName === `eos`) {
      await sendTransaction([
        {
          account: `liquidx.dsp`,
          name: `addaccount`,
          authorization: [
            {
              actor: EOS_ACCOUNT,
              permission: `active`,
            },
          ],
          data: {
            chain_account: WAX_ACCOUNT,
            chain_name: `liquidxxxwax`,
            owner: EOS_ACCOUNT,
           },
        },
      ]);
    }
    process.exit(0);
  } catch (error) {
    // ignore
    process.exit(1);
  }
}

action();
