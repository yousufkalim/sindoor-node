exports.stripeErrors = {
  account_country_invalid_address:
    "Le pays de l'adresse professionnelle fournie ne correspond pas au pays du compte. Les entreprises doivent être situées dans le même pays que le compte.",
  account_error_country_change_requires_additional_steps:
    "Certaines informations de compte ne correspondent pas les unes aux autres. Par exemple, certaines banques peuvent exiger que business_profile.name corresponde au nom du titulaire du compte.",
  account_already_exists:
    "L'adresse e-mail fournie pour la création d'un compte différé est déjà associée à un compte. Utilisez le flux OAuth pour connecter le compte existant à votre plateforme.",
  account_country_invalid_address:
    " Le pays de l'adresse professionnelle fournie ne correspond pas au pays du compte. Les entreprises doivent être situées dans le même pays que le compte.",
  account_invalid:
    " L'ID de compte fourni comme valeur pour l'en-tête Stripe-Account n'est pas valide. Vérifiez que vos demandes spécifient un identifiant de compte valide.",
  account_number_invalid:
    " Le numéro de compte bancaire fourni n'est pas valide (par exemple, des chiffres manquants). Les informations de compte bancaire varient d'un pays à l'autre. Nous vous recommandons de créer des validations dans vos formulaires de saisie en fonction des formats de compte bancaire que nous fournissons.",
  alipay_upgrade_required:
    " Cette méthode de création de paiements Alipay n'est plus prise en charge. Veuillez mettre à niveau votre intégration pour utiliser des sources à la place.",
  amount_too_large:
    " Le montant spécifié est supérieur au montant maximum autorisé. Utilisez une quantité inférieure et réessayez.",
  amount_too_small:
    " Le montant spécifié est inférieur au montant minimum autorisé. Utilisez une quantité plus élevée et réessayez.",
  api_key_expired:
    " La clé API fournie a expiré. Obtenez vos clés API actuelles à partir du tableau de bord et mettez à jour votre intégration pour les utiliser.",
  balance_insufficient:
    " Le transfert ou le paiement n'a pas pu être effectué car le compte associé ne dispose pas d'un solde disponible suffisant. Créez un nouveau virement ou paiement en utilisant un montant inférieur ou égal au solde disponible du compte.",
  bank_account_exists:
    " Le compte bancaire fourni existe déjà sur l'objet Client spécifié. Si le compte bancaire doit également être associé à un autre client, indiquez le bon numéro de client lors de la nouvelle demande.",
  bank_account_unusable:
    " Le compte bancaire fourni ne peut pas être utilisé pour les paiements. Un autre compte bancaire doit être utilisé.",
  bank_account_unverified:
    " Votre plateforme Connect tente de partager un compte bancaire non vérifié avec un compte connecté.",
  bitcoin_upgrade_required:
    " Cette méthode de création de paiements Bitcoin n'est plus prise en charge. Veuillez mettre à niveau votre intégration pour utiliser des sources à la place.",
  card_declined:
    " La carte a été refusée. Lorsqu'une carte est refusée, l'erreur renvoyée inclut également l'attribut déclin_code avec la raison pour laquelle la carte a été refusée. Consultez notre documentation sur les codes de refus pour en savoir plus.",
  charge_already_captured:
    " La charge que vous essayez de capturer a déjà été capturée. Mettez à jour la demande avec un ID de facturation non capturé.",
  charge_already_refunded:
    " Les frais que vous essayez de rembourser ont déjà été remboursés. Mettez à jour la demande d'utilisation de l'ID d'une charge qui n'a pas été remboursée.",
  charge_disputed:
    " Les frais que vous essayez de rembourser ont été remboursés. Consultez la documentation relative aux litiges pour savoir comment réagir au litige.",
  charge_exceeds_source_limit:
    " Ces frais vous amèneraient à dépasser votre limite de traitement de la fenêtre glissante pour ce type de source. Veuillez réessayer les frais plus tard ou contactez-nous pour demander une limite de traitement plus élevée.",
  charge_expired_for_capture:
    " La charge ne peut pas être capturée car l'autorisation a expiré. Les frais d'authentification et de capture doivent être saisis dans les sept jours.",
  country_unsupported:
    " Votre plate-forme a tenté de créer un compte personnalisé dans un pays qui n'est pas encore pris en charge. Assurez-vous que les utilisateurs ne peuvent s'inscrire que dans les pays pris en charge par des comptes personnalisés.",
  coupon_expired:
    " Le coupon fourni pour un abonnement ou une commande a expiré. Créez un nouveau coupon ou utilisez-en un existant valide.",
  customer_max_subscriptions:
    " Le nombre maximum d'abonnements pour un client a été atteint. Contactez-nous si vous recevez cette erreur.",
  email_invalid:
    " L'adresse e-mail n'est pas valide (par exemple, n'est pas correctement formatée). Vérifiez que l'adresse e-mail est correctement formatée et ne comprend que les caractères autorisés.",
  expired_card:
    " La carte a expiré. Vérifiez la date d'expiration ou utilisez une autre carte.",
  idempotency_key_in_use:
    " La clé d'idempotence fournie est actuellement utilisée dans une autre demande. Cela se produit si votre intégration effectue des demandes en double simultanément.",
  incorrect_address:
    " L’adresse de la carte est incorrecte. Vérifiez l’adresse de la carte ou utilisez une autre carte.",
  incorrect_cvc:
    " Le code de sécurité de la carte est incorrect. Vérifiez le code de sécurité de la carte ou utilisez une autre carte.",
  incorrect_number:
    " Le numéro de carte est incorrect. Vérifiez le numéro de la carte ou utilisez une autre carte.",
  incorrect_zip:
    " Le code postal de la carte est incorrect. Vérifiez le code postal de la carte ou utilisez une autre carte.",
  instant_payouts_unsupported:
    " La carte de débit fournie en tant que compte externe ne prend pas en charge les paiements instantanés. Fournissez une autre carte de débit ou utilisez un compte bancaire à la place.",
  invalid_card_type:
    " La carte fournie en tant que compte externe n'est pas une carte de débit. Fournissez une carte de débit ou utilisez plutôt un compte bancaire.",
  invalid_charge_amount:
    " Le montant spécifié n'est pas valide. Le montant des frais doit être un entier positif dans la plus petite unité monétaire et ne pas dépasser le montant minimum ou maximum.",
  invalid_cvc:
    " Le code de sécurité de la carte n’est pas valide. Vérifiez le code de sécurité de la carte ou utilisez une autre carte.",
  invalid_expiry_month:
    " Le mois d'expiration de la carte est incorrect. Vérifiez la date d'expiration ou utilisez une autre carte.",
  invalid_expiry_year:
    " L’année d’expiration de la carte est incorrecte. Vérifiez la date d'expiration ou utilisez une autre carte.",
  invalid_number:
    " Le numéro de carte n'est pas valide. Vérifiez les détails de la carte ou utilisez une autre carte.",
  invalid_source_usage:
    " La source ne peut pas être utilisée car elle n'est pas dans l'état correct (par exemple, une demande de facturation tente d'utiliser une source avec une source en attente, en échec ou consommée). Vérifiez l'état de la source que vous essayez d'utiliser.",
  invoice_no_customer_line_items:
    " Une facture ne peut pas être générée pour le client spécifié car il n'y a aucun poste de facture en attente. Vérifiez que le bon client est spécifié ou créez d'abord les éléments de facture nécessaires.",
  invoice_no_subscription_line_items:
    " Une facture ne peut pas être générée pour l'abonnement spécifié car il n'y a aucun élément de facture en attente. Vérifiez que l'abonnement correct est spécifié ou créez d'abord les éléments de facture nécessaires.",
  invoice_not_editable:
    " La facture spécifiée ne peut plus être modifiée. Au lieu de cela, envisagez de créer des éléments de facture supplémentaires qui seront appliqués à la prochaine facture. Vous pouvez soit générer manuellement la prochaine facture, soit attendre qu'elle soit générée automatiquement à la fin du cycle de facturation.",
  invoice_upcoming_none:
    " Il n'y a pas de facture à venir sur le client spécifié à prévisualiser. Seuls les clients avec des abonnements actifs ou des éléments de facture en attente ont des factures qui peuvent être prévisualisées.",
  livemode_mismatch:
    " Les clés d'API, les requêtes et les objets en mode test et en direct ne sont disponibles que dans le mode dans lequel ils se trouvent.",
  missing:
    " Un client et un identifiant source ont été fournis, mais la source n'a pas été enregistrée pour le client. Pour créer des frais pour un client avec une source spécifiée, vous devez d'abord enregistrer les détails de la carte.",
  not_allowed_on_standard_account:
    " Les transferts et paiements au nom d'un compte connecté Standard ne sont pas autorisés.",
  order_creation_failed:
    " La commande n'a pas pu être créée. Vérifiez les détails de la commande, puis réessayez.",
  order_required_settings:
    " La commande n'a pas pu être traitée car il manque les informations requises. Vérifiez les informations fournies et réessayez.",
  order_status_invalid:
    " La commande ne peut pas être mise à jour car le statut fourni est soit invalide, soit ne suit pas le cycle de vie de la commande (par exemple, une commande ne peut pas passer de créée à exécutée sans passer d'abord à payée).",
  order_upstream_timeout: " La demande a expiré. Réessayez plus tard.",
  out_of_inventory:
    " Le SKU est en rupture de stock. Si plus de stock est disponible, mettez à jour la quantité d'inventaire du SKU et réessayez.",
  parameter_invalid_empty:
    " Une ou plusieurs valeurs obligatoires n'ont pas été fournies. Assurez-vous que les demandes incluent tous les paramètres requis.",
  parameter_invalid_integer:
    " Un ou plusieurs paramètres nécessitent un entier, mais les valeurs fournies étaient d'un type différent. Assurez-vous que seules les valeurs prises en charge sont fournies pour chaque attribut. Reportez-vous à notre documentation API pour rechercher le type de données pris en charge par chaque attribut.",
  parameter_invalid_string_blank:
    " Une ou plusieurs valeurs fournies incluaient uniquement des espaces. Vérifiez les valeurs de votre demande et mettez à jour celles qui ne contiennent que des espaces.",
  parameter_invalid_string_empty:
    " Une ou plusieurs valeurs de chaîne obligatoires sont vides. Assurez-vous que les valeurs de chaîne contiennent au moins un caractère.",
  parameter_missing:
    " Une ou plusieurs valeurs obligatoires sont manquantes. Consultez notre documentation API pour voir quelles valeurs sont requises pour créer ou modifier la ressource spécifiée.",
  parameter_unknown:
    " La demande contient un ou plusieurs paramètres inattendus. Supprimez-les et réessayez.",
  parameters_exclusive:
    " Au moins deux paramètres mutuellement exclusifs ont été fournis. Consultez notre documentation API ou le message d'erreur renvoyé pour voir quelles valeurs sont autorisées lors de la création ou de la modification de la ressource spécifiée.",
  payment_intent_authentication_failure:
    " L'authentification de la source fournie a échoué. Fournissez source_data ou une nouvelle source pour tenter de remplir à nouveau ce PaymentIntent.",
  payment_intent_incompatible_payment_method:
    " PaymentIntent s'attendait à un mode de paiement avec des propriétés différentes de celles fournies.",
  payment_intent_invalid_parameter:
    " Un ou plusieurs paramètres fournis n'étaient pas autorisés pour l'opération donnée sur PaymentIntent. Consultez notre référence API ou le message d'erreur renvoyé pour voir quelles valeurs n'étaient pas correctes pour ce PaymentIntent.",
  payment_intent_payment_attempt_failed:
    " La dernière tentative de paiement pour PaymentIntent a échoué. Vérifiez la propriété last_payment_error sur le PaymentIntent pour plus de détails, et indiquez source_data ou une nouvelle source pour tenter à nouveau de remplir ce PaymentIntent.",
  payment_intent_unexpected_state:
    " L'état de PaymentIntent était incompatible avec l'opération que vous tentiez d'effectuer.",
  payment_method_unactivated:
    " Les frais ne peuvent pas être créés car le mode de paiement utilisé n'a pas été activé. Activez le mode de paiement dans le tableau de bord, puis réessayez.",
  payment_method_unexpected_state:
    " L'état du mode de paiement fourni était incompatible avec l'opération que vous tentiez d'effectuer. Vérifiez que le mode de paiement est dans un état autorisé pour l'opération donnée avant de tenter de l'exécuter.",
  payouts_not_allowed:
    " Les paiements ont été désactivés sur le compte connecté. Vérifiez l'état du compte connecté pour voir si des informations supplémentaires doivent être fournies ou si les paiements ont été désactivés pour une autre raison.",
  platform_api_key_expired:
    " La clé API fournie par votre plateforme Connect a expiré. Cela se produit si votre plateforme a généré une nouvelle clé ou si le compte connecté a été déconnecté de la plateforme. Obtenez vos clés API actuelles à partir du tableau de bord et mettez à jour votre intégration, ou contactez l'utilisateur et reconnectez le compte.",
  postal_code_invalid: " Le code postal fourni était incorrect.",
  processing_error:
    " Une erreur s'est produite lors du traitement de la carte. Vérifiez que les détails de la carte sont corrects ou utilisez une autre carte.",
  product_inactive:
    " Le produit auquel ce SKU appartient n'est plus disponible à l'achat.",
  rate_limit:
    " Trop de demandes atteignent l'API trop rapidement. Nous recommandons un délai exponentiel de vos demandes.",
  resource_already_exists:
    " Une ressource avec un ID spécifié par l'utilisateur (par exemple, plan ou coupon) existe déjà. Utilisez une valeur différente et unique pour id et réessayez.",
  resource_missing:
    " L'identifiant fourni n'est pas valide. Soit la ressource n'existe pas, soit un ID pour une ressource différente a été fourni.",
  routing_number_invalid:
    " Le numéro d'acheminement bancaire fourni n'est pas valide.",
  secret_key_required:
    " La clé API fournie est une clé publiable, mais une clé secrète est requise. Obtenez vos clés API actuelles à partir du tableau de bord et mettez à jour votre intégration pour les utiliser.",
  sepa_unsupported_account:
    " Votre compte ne prend pas en charge les paiements SEPA.",
  shipping_calculation_failed:
    " Le calcul de l'expédition a échoué car les informations fournies étaient incorrectes ou n'ont pas pu être vérifiées.",
  sku_inactive:
    " Le SKU est inactif et n'est plus disponible à l'achat. Utilisez un SKU différent ou réactivez le SKU actuel.",
  state_unsupported:
    " Se produit lors de la fourniture des informations legal_entity pour un compte personnalisé américain, si l'état fourni n'est pas pris en charge. (Il s'agit principalement d'états et de territoires associés.)",
  tax_id_invalid:
    " Le numéro d'identification fiscale fourni n'est pas valide (par exemple, des chiffres manquants). Les informations d'identification fiscale varient d'un pays à l'autre, mais doivent comporter au moins neuf chiffres.",
  taxes_calculation_failed: " Le calcul de la taxe pour la commande a échoué.",
  testmode_charges_only:
    " Votre compte n'a pas été activé et ne peut effectuer que des frais de test. Activez votre compte dans le tableau de bord pour commencer à traiter les frais réels.",
  tls_version_unsupported:
    " Votre intégration utilise une ancienne version de TLS qui n'est pas prise en charge. Vous devez utiliser TLS 1.2 ou supérieur.",
  token_already_used:
    " Le jeton fourni a déjà été utilisé. Vous devez créer un nouveau jeton avant de pouvoir réessayer cette demande.",
  token_in_use:
    " Le jeton fourni est actuellement utilisé dans une autre demande. Cela se produit si votre intégration effectue des demandes en double simultanément.",
  transfers_not_allowed:
    " Le transfert demandé ne peut pas être créé. Contactez-nous si vous recevez cette erreur.",
  upstream_order_creation_failed:
    " La commande n'a pas pu être créée. Vérifiez les détails de la commande, puis réessayez.",
  url_invalid: " L'URL fournie n'est pas valide.",
  phone: "Numéro de téléphone invalide",
};
