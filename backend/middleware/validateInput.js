import { body, param, validationResult } from "express-validator";

/**
 * Middleware para lidar com erros de validação
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validação falhou",
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validações para registro de usuário
 */
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),
  
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
  
  body("password")
    .isLength({ min: 8 })
    .withMessage("Senha deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Senha deve conter maiúscula, minúscula e número"),

  handleValidationErrors
];

/**
 * Validações para login
 */
export const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória"),

  handleValidationErrors
];

/**
 * Validações para criar produto
 */
export const validateProduct = [
  body("nome")
    .trim()
    .notEmpty()
    .withMessage("Nome do produto é obrigatório")
    .isLength({ min: 3, max: 200 })
    .withMessage("Nome deve ter entre 3 e 200 caracteres"),
  
  body("descricao")
    .trim()
    .notEmpty()
    .withMessage("Descrição é obrigatória")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Descrição deve ter entre 10 e 1000 caracteres"),
  
  body("valor")
    .isFloat({ min: 0.01 })
    .withMessage("Valor deve ser maior que 0"),

  body("quantidade")
    .isInt({ min: 0 })
    .withMessage("Quantidade deve ser um número inteiro maior ou igual a 0"),
  
  body("categoria")
    .trim()
    .notEmpty()
    .withMessage("Categoria é obrigatória"),

  handleValidationErrors
];

/**
 * Validações para atualizar produto
 */
export const validateProductUpdate = [
  param("id")
    .isMongoId()
    .withMessage("ID inválido"),

  body("nome")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Nome deve ter entre 3 e 200 caracteres"),
  
  body("descricao")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Descrição deve ter entre 10 e 1000 caracteres"),
  
  body("valor")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Valor deve ser maior que 0"),

  handleValidationErrors
];

/**
 * Validações para deletar
 */
export const validateMongoId = [
  param("id")
    .isMongoId()
    .withMessage("ID inválido"),

  handleValidationErrors
];

/**
 * Validações para delivery
 */
export const validateDelivery = [
  body("cliente")
    .trim()
    .notEmpty()
    .withMessage("Nome do cliente é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres")
    .escape(),
  
  body("endereco")
    .trim()
    .notEmpty()
    .withMessage("Endereço é obrigatório")
    .isLength({ min: 5, max: 300 })
    .withMessage("Endereço deve ter entre 5 e 300 caracteres")
    .escape(),
  
  body("valorVenda")
    .isFloat({ min: 0.01 })
    .withMessage("Valor deve ser maior que 0"),
  
  body("statusEntrega")
    .trim()
    .isIn(["pendente", "enviado", "entregue", "cancelado"])
    .withMessage("StatusEntrega inválido"),

  handleValidationErrors
];
