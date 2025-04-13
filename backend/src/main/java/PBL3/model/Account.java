package PBL3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ACCOUNT")
public class Account {
    @Id
    private Long idACCOUNT;
    private String usernameACCOUNT;
    private String passwordACCOUNT;
    private int roleACCOUNT;
    
    public Long getIdACC() {
        return idACCOUNT;
    }
    public void setIdACC(Long newID) {
        this.idACCOUNT = newID;
    }
    public String getUsernameACC() {
        return usernameACCOUNT;
    }
    public void setUsernameACC(String newUser) {
        this.usernameACCOUNT = newUser;
    }
    public String getPasswordACC() {
        return passwordACCOUNT;
    }

    public void setPasswordACC(String newPassword) {
        this.passwordACCOUNT= newPassword;
    }

    public int getRoleACC() {
        return roleACCOUNT;
    }

    public void setRoleACC(int newRole) {
        this.roleACCOUNT = newRole;
    }
    public String getRoleAsString() {
        switch(roleACCOUNT) {
            case 0: return "ADMIN";
            case 1: return "USER";
            case 2: return "GUEST";
            default: return "Ngoài phạm vi phân quyền";
        }
    }
    public void setRoleFormString(String role) {
        switch(role.toUpperCase()) {
            case "ADMIN": this.roleACCOUNT = 0; break;
            case "USER": this.roleACCOUNT = 1; break;
            case "GUEST": this.roleACCOUNT = 2; break;
            default: this.roleACCOUNT = -1;
        }
    }
}
