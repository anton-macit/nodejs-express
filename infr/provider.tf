terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state in S3 with DynamoDB locking. The bucket and table names stay
  # out of the repository: copy backend.hcl.example to backend.hcl, fill it in
  # and run `terraform init -backend-config=backend.hcl`.
  backend "s3" {
    key     = "nodejs-express/terraform.tfstate"
    region  = "eu-central-1"
    encrypt = true
  }
}

provider "aws" {
  region = "eu-central-1"
}
