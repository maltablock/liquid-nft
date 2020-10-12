#include <eosio/eosio.hpp>
using namespace eosio;

class [[eosio::contract("contract")]] auth : public contract {
   public:
      using contract::contract;

      ACTION login( name user );

      using login_action = action_wrapper<"login"_n, &auth::login>;
};