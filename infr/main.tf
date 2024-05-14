resource "aws_resourcegroups_group" "tf-todo" {
  name = var.rg_name

  resource_query {
    query = <<JSON
{
  "ResourceTypeFilters": [
    "AWS::AllSupported"
  ],
  "TagFilters": [
    {
      "Key": "${var.rg_tag_name}",
      "Values": ["${var.rg_name}"]
    }
  ]
}
JSON
  }
}

resource "aws_iam_role" "iam_role" {
  name = var.name_iam_role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = {
    (var.rg_tag_name) = var.rg_name # todo - not visible in AWS resource group
  }
}

resource "aws_iam_policy" "iam_policy" {
  name        = var.name_iam_policy
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Resource = ["arn:aws:logs:*:*:*"]
    },{
      Effect = "Allow"
      Action = [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface"
      ]
      Resource = ["*"]
    },{
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:ListSecretVersionIds"
      ],
      "Resource": [
        aws_secretsmanager_secret.secret.arn,
      ]
    }]
  })

  tags = {
    (var.rg_tag_name) = var.rg_name # todo - not visible in AWS resource group
  }
}

resource "aws_iam_role_policy_attachment" "iam_role_policy_attachment" {
  policy_arn = aws_iam_policy.iam_policy.arn
  role = aws_iam_role.iam_role.name
}

data "archive_file" "deps_layer_code_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/layers/deps-layer/"
  output_path = "${path.module}/../dist/deps.zip"
}

// Dedicated layer allows upload new (update) node_modules only when it's really needed
resource "aws_lambda_layer_version" "lambda_deps_layer" {
  layer_name          = "shared_deps"

  filename            = data.archive_file.deps_layer_code_zip.output_path
  source_code_hash    = data.archive_file.deps_layer_code_zip.output_base64sha256

  compatible_runtimes = [ "nodejs20.x" ]
}

data "archive_file" "src_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/src"
  output_path = "${path.module}/../dist/function.zip"
}

resource "aws_lambda_function" "lambda" {
  function_name    = var.name_lambda_function
  filename         = data.archive_file.src_zip.output_path
  source_code_hash = data.archive_file.src_zip.output_base64sha256
  handler          = "index.handler"
  role             = aws_iam_role.iam_role.arn
  runtime          = "nodejs20.x"
  timeout          = var.lambda_timeout

  layers = [
    aws_lambda_layer_version.lambda_deps_layer.arn
  ]

  tags = {
    (var.rg_tag_name) = var.rg_name
  }

  environment {
    variables = {
      "NODE_ENV": "dev"
      "AWS_SECRET_NAME": var.secret_name
      # "AWS_REGION" - AWS gives this variable itself
    }
  }
}

resource "aws_lambda_function_url" "url" {
  function_name      = aws_lambda_function.lambda.function_name
  authorization_type = "NONE"
}

output "function_url" {
  value = aws_lambda_function_url.url.function_url
}

resource "aws_secretsmanager_secret" "secret" {
  name = "settings"
}

// fill real values on AWS side after applying
variable "settings" {
  default = {
    dbConnectionString = ""
    superAdminUsername = ""
    superAdminPassword = ""
    jwtSecret = ""
  }

  type = map(string)
}

resource "aws_secretsmanager_secret_version" "secret_version" {
  secret_id     = aws_secretsmanager_secret.secret.id
  secret_string = jsonencode(var.settings)
}
