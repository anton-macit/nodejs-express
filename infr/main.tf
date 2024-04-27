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

resource "aws_lambda_function" "lambda" {
  function_name    = var.name_lambda_function
  filename         = "lambda_function_payload.zip"
  handler          = "index.handler"
  role             = aws_iam_role.iam_role.arn
  runtime          = "nodejs20.x"

  tags = {
    (var.rg_tag_name) = var.rg_name
  }
}

resource "aws_lambda_function_url" "url" {
  function_name      = aws_lambda_function.lambda.function_name
  authorization_type = "NONE"
}

output "function_url" {
  value = aws_lambda_function_url.url.function_url
}
