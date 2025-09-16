import { PasswordResetConfirm } from '../../components/auth/passwordReset'
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';
import TertiaryFrame from '../../components/ui/layout/TertiaryFrame';

const PasswordResetConfirmPage = () => {
    return (
        <MainFrame>
            <SecondaryFrame>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4 col-xxl-3 smooth-col p-0">
                        <TertiaryFrame>
                            <PasswordResetConfirm />
                        </TertiaryFrame>
                    </div>
                </div>
            </SecondaryFrame>
        </MainFrame>
    )
}

export default PasswordResetConfirmPage;
