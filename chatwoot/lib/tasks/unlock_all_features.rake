namespace :chatwoot do
  namespace :unlock do
    desc 'Habilita todos os recursos e define o plano padrão como enterprise'
    task all: :environment do
      features = YAML.safe_load(Rails.root.join('config/features.yml').read)
      feature_names = features.map { |feature| feature['name'] }

      config = InstallationConfig.find_or_initialize_by(name: 'ACCOUNT_LEVEL_FEATURE_DEFAULTS')
      config.value = features
      config.locked = true
      config.save!

      plan_config = InstallationConfig.find_or_initialize_by(name: 'INSTALLATION_PRICING_PLAN')
      plan_config.value = 'enterprise'
      plan_config.locked = false
      plan_config.save!

      quantity_config = InstallationConfig.find_or_initialize_by(name: 'INSTALLATION_PRICING_PLAN_QUANTITY')
      quantity_config.value = ChatwootApp.max_limit
      quantity_config.locked = false
      quantity_config.save!

      Account.find_each do |account|
        account.enable_features(*feature_names)
        account.save! if account.changed?
      end

      puts "✅ #{feature_names.count} recursos habilitados para #{Account.count} contas."
    end
  end
end
