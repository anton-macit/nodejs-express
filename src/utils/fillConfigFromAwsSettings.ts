import { config } from "@Config";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { log } from "@Log";

export const fillConfigFromAwsSettings = async () => {
  if (config.get("dbConnectionString") !== "") {
    return;
  }

  const secretName = config.get("aws.secretName");

  const region = config.get("aws.region");
  const client = new SecretsManagerClient({
    region,
  });

  log.debug(`aws related settings`, { secretName, region });

  const response = (
    await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      }),
    )
  ).SecretString;
  const secretProperties = JSON.parse(response ?? "{}");
  config.set("dbConnectionString", secretProperties.dbConnectionString);
  config.set("superAdmin.username", secretProperties.superAdminUsername);
  config.set("superAdmin.password", secretProperties.superAdminPassword);
  config.set("jwt.secret", secretProperties.jwtSecret);
  log.debug(
    `secretProperties.superAdminUsername: ${secretProperties.superAdminUsername}`,
  );
};
