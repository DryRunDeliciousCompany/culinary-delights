# ---------------------------------------------
# Variables
# ---------------------------------------------
variable "project" {
  type    = string
  default = "tastylog"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "domain" {
  type = string
}

variable "username" {
  type    = string
  default = "admin"
}

variable "password" {
  type = string
}